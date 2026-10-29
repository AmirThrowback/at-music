package com.amirthrowback.atmusic

import android.app.Application
import android.content.Context
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items as gridItems
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.graphics.drawable.toBitmap
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import androidx.palette.graphics.Palette
import coil.ImageLoader
import coil.compose.AsyncImage
import coil.request.ImageRequest
import coil.request.SuccessResult
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.util.Locale

// ==========================================
// 1. BRAND
// ==========================================
val AtPink = Color(0xFFFF2D6F)
val AtBackground = Color(0xFF0E0B12)
val AtSurface = Color(0xFF1A1520)
val AtMuted = Color(0xFFB3A9BA)

// ==========================================
// 2. DATA MODELS
// ==========================================
data class LyricLine(val timeMs: Long, val text: String)

data class Region(val id: String, val name: String, val nativeName: String, val accent: Color)

data class Track(
    val id: String,
    val title: String,
    val artist: String,
    val regionId: String,
    val streamUrl: String,
    val artworkUrl: String,
    val lyrics: List<LyricLine>
)

data class Playlist(
    val id: String,
    val title: String,
    val subtitle: String,
    val regionId: String,
    val tracks: List<Track>
)

data class AlbumColors(
    val primaryColor: Color = Color(0xFF7A1F45),
    val secondaryColor: Color = Color(0xFF1A1020),
    val tertiaryColor: Color = Color.Black
)

data class AtMusicUiState(
    val onboardingDone: Boolean = false,
    val preferredRegionIds: Set<String> = emptySet(),
    val selectedRegionId: String = AtCatalog.ALL_INDIA,
    val queue: List<Track> = emptyList(),
    val currentIndex: Int = -1,
    val isPlaying: Boolean = false,
    val positionMs: Long = 0L,
    val durationMs: Long = 0L,
    val albumColors: AlbumColors = AlbumColors(),
    val favoriteIds: Set<String> = emptySet(),
    val shuffle: Boolean = false,
    val repeatMode: Int = Player.REPEAT_MODE_OFF,
    val showNowPlaying: Boolean = false
) {
    val currentTrack: Track? get() = queue.getOrNull(currentIndex)
}

/** Parses standard .lrc text ("[01:23.45] line") so real timed lyrics can be dropped in. */
fun parseLrc(lrc: String): List<LyricLine> {
    val tag = Regex("""\[(\d+):(\d{2})(?:[.:](\d{1,3}))?]""")
    return lrc.lines().flatMap { line ->
        val text = line.replace(tag, "").trim()
        tag.findAll(line).map { match ->
            val (min, sec, frac) = match.destructured
            val fracMs = when (frac.length) {
                0 -> 0
                1 -> frac.toInt() * 100
                2 -> frac.toInt() * 10
                else -> frac.toInt()
            }
            LyricLine(min.toLong() * 60_000 + sec.toLong() * 1_000 + fracMs, text)
        }.toList()
    }.filter { it.text.isNotEmpty() }.sortedBy { it.timeMs }
}

// ==========================================
// 3. ALL-INDIA ROMANCE CATALOG
// Demo audio is SoundHelix; swap streamUrl/artworkUrl for real Amir Throwback masters.
// ==========================================
object AtCatalog {
    const val ALL_INDIA = "all"
    private const val LINE_GAP_MS = 7_000L

    val allIndia = Region(ALL_INDIA, "All India", "भारत", AtPink)

    val regions = listOf(
        Region("hindi", "Hindi", "हिंदी", Color(0xFFE91E63)),
        Region("punjabi", "Punjabi", "ਪੰਜਾਬੀ", Color(0xFFEF6C00)),
        Region("tamil", "Tamil", "தமிழ்", Color(0xFFC62828)),
        Region("telugu", "Telugu", "తెలుగు", Color(0xFF8E24AA)),
        Region("malayalam", "Malayalam", "മലയാളം", Color(0xFF2E7D32)),
        Region("kannada", "Kannada", "ಕನ್ನಡ", Color(0xFFB28704)),
        Region("bengali", "Bengali", "বাংলা", Color(0xFF1565C0)),
        Region("marathi", "Marathi", "मराठी", Color(0xFFD84315)),
        Region("gujarati", "Gujarati", "ગુજરાતી", Color(0xFF00838F)),
        Region("bhojpuri", "Bhojpuri", "भोजपुरी", Color(0xFF6D4C41))
    )

    val hubs = listOf(allIndia) + regions

    fun region(id: String): Region = hubs.firstOrNull { it.id == id } ?: allIndia

    private fun track(id: String, demo: Int, title: String, regionId: String, vararg lines: String) = Track(
        id = id,
        title = title,
        artist = "Amir Throwback",
        regionId = regionId,
        streamUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-$demo.mp3",
        artworkUrl = "https://picsum.photos/seed/atmusic-$id/800",
        lyrics = lines.mapIndexed { i, text -> LyricLine(i * LINE_GAP_MS, text) }
    )

    val tracks = listOf(
        track(
            "hi_adhoora", 1, "Tere Bina Adhoora", "hindi",
            "Shaam dhali, teri yaad aayi",
            "Khamosh lamhon mein teri parchhaayi",
            "Tu jo nahi, sab kuch adhoora",
            "Dil ne kaha, bas tu hi poora",
            "Tere bina adhoora main, tere bina adhoora",
            "Saans bhi ruki si hai, lamha bhi thehra",
            "Aaja ve, aaja ve, mere paas aaja",
            "Tere bina adhoora main, tere bina adhoora"
        ),
        track(
            "hi_baarish", 2, "Baarish Waali Baat", "hindi",
            "Bheegi bheegi raaton mein",
            "Teri meri baaton mein",
            "Chhupi hai ek baarish waali baat",
            "Haathon mein jo haath ho tera",
            "Ruk jaaye ye saara savera",
            "Baarish waali baat hai, tu mere saath hai"
        ),
        track(
            "hi_retro", 3, "Retro Dil", "hindi",
            "Cassette pe tera naam likha",
            "Purane gaane, naya sa nasha",
            "Dil mera retro, pyaar mera classic",
            "Tu hi meri dhun, tu hi mera music",
            "Rewind karun to tu hi dikhe",
            "Play karun to tu hi mile"
        ),
        track(
            "pa_soniye", 4, "Soniye Ve", "punjabi",
            "Soniye ve, tere naal dil laga",
            "Chann jeha mukhda, nain tere gulabi",
            "Tu jadon hasdi, rang jaave asmaan",
            "Mera dil tera, tu meri jaan",
            "Soniye ve, soniye ve",
            "Saari duniya ton sohni tu"
        ),
        track(
            "ta_anbe", 5, "Anbe Anbe", "tamil",
            "Anbe anbe, nee en uyire",
            "Teri aankhon mein kadhal ka samandar",
            "Marina ki lehrein, tu mere andar",
            "Kadhal kadhal, bas tujhse kadhal",
            "Anbe anbe, nee en uyire"
        ),
        track(
            "te_prema", 6, "Prema Nuvve", "telugu",
            "Nuvve naa prema, nuvve naa lokam",
            "Tere bina adhoori har kahani",
            "Godavari ki lehron jaisi tu deewani",
            "Prema prema, dil ne pukara",
            "Nuvve naa prema, tu hi sahara"
        ),
        track(
            "ml_pranayam", 7, "Ente Pranayam", "malayalam",
            "Kerala ki baarish, hari hari raahein",
            "Teri yaadon mein bheegi meri baahein",
            "Ente pranayam, sirf tere naam",
            "Nee ente jeevan, nee ente shaam"
        ),
        track(
            "kn_preethi", 8, "Nanna Preethi", "kannada",
            "Mysore ki galiyon mein tera intezaar",
            "Chandan si khushboo, tera pyaar",
            "Neene nanna preethi, neene nanna jeeva",
            "Dil se dil tak, ek hi dhun"
        ),
        track(
            "bn_tumi", 9, "Tumi Amar", "bengali",
            "Kolkata ki shaam, Hooghly ka kinara",
            "Tera mera milna, jaise koi ishaara",
            "Tumi amar bhalobasha",
            "Ami tomake bhalobashi, sun le na"
        ),
        track(
            "mr_tuch", 10, "Tuch Majhi Preet", "marathi",
            "Mumbai ki baarish, Marine Drive pe tu",
            "Har lehar kahe, bas tu hi tu",
            "Tuch majhi preet, tuch majha shwas",
            "Prem ha khara, tu mere paas"
        ),
        track(
            "gu_tame", 11, "Tame Maari Jaan", "gujarati",
            "Garba ki raat, dhol ki dhun",
            "Teri payal mein mera junoon",
            "Tame maari jaan, maaro prem tame",
            "Navratri ke rang, sang ho hum"
        ),
        track(
            "bh_piya", 12, "Piya Ho", "bhojpuri",
            "Piya ho, tohre bina jiyara na laage",
            "Ganga kinare baithi, raah tohar taakein",
            "Chaand bhi poochhe, kahan gaile piya",
            "Piya ho, piya ho, aaja more jiya"
        )
    )

    private fun tracksOf(vararg regionIds: String) = tracks.filter { it.regionId in regionIds }

    val playlists: List<Playlist> = listOf(
        Playlist("p_all", "All India Romance", "Ek dil, das bhashayein", ALL_INDIA, tracks),
        Playlist("p_hindi", "Hindi Romance", "Dil se, Amir Throwback ke saath", "hindi", tracksOf("hindi")),
        Playlist("p_throwback", "Throwback Pyaar", "Retro vibes, naya ishq", "hindi",
            tracks.filter { it.id in setOf("hi_retro", "hi_adhoora", "hi_baarish") }.reversed()),
        Playlist("p_south", "South Ki Kadhal", "Tamil · Telugu · Malayalam · Kannada", ALL_INDIA,
            tracksOf("tamil", "telugu", "malayalam", "kannada")),
        Playlist("p_west_east", "Dil Se Desh", "Punjab se Bengal tak", ALL_INDIA,
            tracksOf("punjabi", "bengali", "marathi", "gujarati", "bhojpuri"))
    )

    fun sectionsFor(regionId: String, preferred: Set<String>): List<Playlist> {
        if (regionId == ALL_INDIA) {
            val forYouTracks = tracks.filter { it.regionId in preferred }
            val forYou = if (forYouTracks.isEmpty()) emptyList() else listOf(
                Playlist("p_for_you", "Made for You", "Aapki bhashayein, sirf romance", ALL_INDIA, forYouTracks)
            )
            return forYou + playlists.sortedByDescending { it.regionId in preferred }
        }
        val hub = region(regionId)
        val hubPlaylist = Playlist("p_hub_$regionId", "${hub.name} Romance", hub.nativeName, regionId, tracksOf(regionId))
        return listOf(hubPlaylist) + playlists.filter { p ->
            p.id != "p_$regionId" && p.tracks.any { it.regionId == regionId }
        }
    }
}

// ==========================================
// 4. VIEWMODEL (ExoPlayer is the source of truth for playback state)
// ==========================================
class AtMusicViewModel(app: Application) : AndroidViewModel(app) {
    private val prefs = app.getSharedPreferences("at_music", Context.MODE_PRIVATE)
    private val imageLoader = ImageLoader(app)
    private val player: ExoPlayer = ExoPlayer.Builder(app).build()

    private val _uiState = MutableStateFlow(
        AtMusicUiState(
            onboardingDone = prefs.getBoolean(KEY_ONBOARDED, false),
            preferredRegionIds = prefs.getStringSet(KEY_REGIONS, emptySet()).orEmpty().toSet(),
            favoriteIds = prefs.getStringSet(KEY_FAVORITES, emptySet()).orEmpty().toSet()
        )
    )
    val uiState: StateFlow<AtMusicUiState> = _uiState.asStateFlow()

    private var progressJob: Job? = null
    private var colorsJob: Job? = null

    private val listener = object : Player.Listener {
        override fun onIsPlayingChanged(isPlaying: Boolean) {
            _uiState.update { it.copy(isPlaying = isPlaying) }
            if (isPlaying) startProgressUpdates() else {
                progressJob?.cancel()
                syncPosition()
            }
        }

        override fun onMediaItemTransition(mediaItem: MediaItem?, reason: Int) {
            _uiState.update { it.copy(currentIndex = player.currentMediaItemIndex, positionMs = 0L, durationMs = 0L) }
            _uiState.value.currentTrack?.let { loadAlbumColors(it.artworkUrl) }
        }

        override fun onPlaybackStateChanged(playbackState: Int) {
            if (playbackState == Player.STATE_READY) syncPosition()
        }

        override fun onShuffleModeEnabledChanged(shuffleModeEnabled: Boolean) {
            _uiState.update { it.copy(shuffle = shuffleModeEnabled) }
        }

        override fun onRepeatModeChanged(repeatMode: Int) {
            _uiState.update { it.copy(repeatMode = repeatMode) }
        }
    }

    init {
        player.addListener(listener)
    }

    fun completeOnboarding(regionIds: Set<String>) {
        prefs.edit().putBoolean(KEY_ONBOARDED, true).putStringSet(KEY_REGIONS, regionIds).apply()
        _uiState.update { it.copy(onboardingDone = true, preferredRegionIds = regionIds) }
    }

    fun editLanguages() = _uiState.update { it.copy(onboardingDone = false) }

    fun selectRegion(regionId: String) = _uiState.update { it.copy(selectedRegionId = regionId) }

    fun setNowPlayingVisible(visible: Boolean) = _uiState.update { it.copy(showNowPlaying = visible) }

    fun playQueue(tracks: List<Track>, startIndex: Int) {
        val items = tracks.map { MediaItem.Builder().setMediaId(it.id).setUri(it.streamUrl).build() }
        _uiState.update { it.copy(queue = tracks, currentIndex = startIndex, positionMs = 0L, durationMs = 0L) }
        player.setMediaItems(items, startIndex, 0L)
        player.prepare()
        player.play()
    }

    fun togglePlayPause() {
        if (player.isPlaying) {
            player.pause()
        } else {
            if (player.playbackState == Player.STATE_ENDED) player.seekTo(player.currentMediaItemIndex, 0L)
            player.play()
        }
    }

    fun skipNext() {
        if (player.hasNextMediaItem()) player.seekToNextMediaItem()
    }

    fun skipPrevious() = player.seekToPrevious()

    fun seekTo(positionMs: Long) {
        player.seekTo(positionMs)
        _uiState.update { it.copy(positionMs = positionMs) }
    }

    fun toggleShuffle() {
        player.shuffleModeEnabled = !player.shuffleModeEnabled
    }

    fun cycleRepeat() {
        player.repeatMode = when (player.repeatMode) {
            Player.REPEAT_MODE_OFF -> Player.REPEAT_MODE_ALL
            Player.REPEAT_MODE_ALL -> Player.REPEAT_MODE_ONE
            else -> Player.REPEAT_MODE_OFF
        }
    }

    fun toggleFavorite(trackId: String) {
        val updated = _uiState.value.favoriteIds.let { if (trackId in it) it - trackId else it + trackId }
        prefs.edit().putStringSet(KEY_FAVORITES, updated).apply()
        _uiState.update { it.copy(favoriteIds = updated) }
    }

    private fun startProgressUpdates() {
        progressJob?.cancel()
        progressJob = viewModelScope.launch {
            while (isActive) {
                syncPosition()
                delay(250)
            }
        }
    }

    private fun syncPosition() {
        _uiState.update {
            it.copy(positionMs = player.currentPosition, durationMs = player.duration.coerceAtLeast(0L))
        }
    }

    private fun loadAlbumColors(imageUrl: String) {
        colorsJob?.cancel()
        colorsJob = viewModelScope.launch {
            val colors = extractPaletteColors(imageUrl)
            _uiState.update { it.copy(albumColors = colors) }
        }
    }

    private suspend fun extractPaletteColors(imageUrl: String): AlbumColors = withContext(Dispatchers.IO) {
        try {
            val app = getApplication<Application>()
            val request = ImageRequest.Builder(app).data(imageUrl).allowHardware(false).build()
            val bitmap = (imageLoader.execute(request) as? SuccessResult)?.drawable?.toBitmap()
                ?: return@withContext AlbumColors()
            val palette = Palette.from(bitmap).generate()
            AlbumColors(
                primaryColor = palette.dominantSwatch?.rgb?.let { Color(it) } ?: AlbumColors().primaryColor,
                secondaryColor = (palette.darkVibrantSwatch ?: palette.darkMutedSwatch)?.rgb?.let { Color(it) }
                    ?: AlbumColors().secondaryColor
            )
        } catch (e: Exception) {
            AlbumColors()
        }
    }

    override fun onCleared() {
        super.onCleared()
        progressJob?.cancel()
        player.removeListener(listener)
        player.release()
    }

    private companion object {
        const val KEY_ONBOARDED = "onboarding_done"
        const val KEY_REGIONS = "preferred_regions"
        const val KEY_FAVORITES = "favorites"
    }
}

// ==========================================
// 5. ACTIVITY ENTRY POINT
// ==========================================
class AtMusicActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MaterialTheme(
                colorScheme = darkColorScheme(primary = AtPink, background = AtBackground, surface = AtSurface)
            ) {
                AtMusicApp(viewModel())
            }
        }
    }
}

@Composable
fun AtMusicApp(vm: AtMusicViewModel) {
    val state by vm.uiState.collectAsState()
    val homeListState = rememberLazyListState()

    when {
        !state.onboardingDone -> OnboardingScreen(initial = state.preferredRegionIds, onDone = vm::completeOnboarding)
        state.showNowPlaying && state.currentTrack != null -> {
            BackHandler { vm.setNowPlayingVisible(false) }
            NowPlayingScreen(state, vm)
        }
        else -> Box(Modifier.fillMaxSize().background(AtBackground)) {
            HomeScreen(state, vm, homeListState)
            MiniPlayer(
                state, vm,
                Modifier.align(Alignment.BottomCenter).navigationBarsPadding().padding(8.dp)
            )
        }
    }
}

// ==========================================
// 6. LANGUAGE ONBOARDING
// ==========================================
@Composable
fun OnboardingScreen(initial: Set<String>, onDone: (Set<String>) -> Unit) {
    var selected by remember { mutableStateOf(initial) }

    Column(
        Modifier
            .fillMaxSize()
            .background(AtBackground)
            .systemBarsPadding()
            .padding(20.dp)
    ) {
        Text("AT Music", color = AtPink, fontWeight = FontWeight.Black, fontSize = 28.sp)
        Spacer(Modifier.height(8.dp))
        Text("Kis bhasha mein pyaar sunna hai?", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold)
        Text("Pick the languages you love. You can change this anytime.", color = AtMuted, fontSize = 14.sp)
        Spacer(Modifier.height(20.dp))

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            modifier = Modifier.weight(1f),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            gridItems(AtCatalog.regions) { region ->
                val isSelected = region.id in selected
                Box(
                    Modifier
                        .height(88.dp)
                        .clip(RoundedCornerShape(14.dp))
                        .background(Brush.linearGradient(listOf(region.accent, region.accent.copy(alpha = 0.35f))))
                        .clickable { selected = if (isSelected) selected - region.id else selected + region.id }
                        .padding(14.dp)
                ) {
                    Column(Modifier.align(Alignment.BottomStart)) {
                        Text(region.nativeName, color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                        Text(region.name, color = Color.White.copy(alpha = 0.85f), fontSize = 13.sp)
                    }
                    if (isSelected) {
                        Icon(
                            Icons.Default.CheckCircle, contentDescription = "Selected",
                            tint = Color.White, modifier = Modifier.align(Alignment.TopEnd)
                        )
                    }
                }
            }
        }

        Spacer(Modifier.height(12.dp))
        Button(
            onClick = { onDone(selected) },
            enabled = selected.isNotEmpty(),
            modifier = Modifier.fillMaxWidth().height(52.dp),
            colors = ButtonDefaults.buttonColors(containerColor = AtPink)
        ) {
            Text("Shuru karein", fontWeight = FontWeight.Bold, fontSize = 16.sp)
        }
    }
}

// ==========================================
// 7. HOME: REGIONAL HUBS + PLAYLIST CAROUSELS
// ==========================================
@Composable
fun HomeScreen(state: AtMusicUiState, vm: AtMusicViewModel, listState: LazyListState) {
    val sections = remember(state.selectedRegionId, state.preferredRegionIds) {
        AtCatalog.sectionsFor(state.selectedRegionId, state.preferredRegionIds)
    }

    LazyColumn(
        state = listState,
        modifier = Modifier.fillMaxSize().statusBarsPadding(),
        contentPadding = PaddingValues(top = 12.dp, bottom = 120.dp)
    ) {
        item {
            Row(
                Modifier.fillMaxWidth().padding(horizontal = 16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(Modifier.weight(1f)) {
                    Text("AT Music", color = AtPink, fontWeight = FontWeight.Black, fontSize = 28.sp)
                    Text("Pyaar ke gaane, poore Bharat se", color = AtMuted, fontSize = 13.sp)
                }
                IconButton(onClick = vm::editLanguages) {
                    Icon(Icons.Default.Translate, contentDescription = "Change languages", tint = Color.White)
                }
            }
        }

        item {
            LazyRow(
                modifier = Modifier.padding(top = 16.dp),
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(AtCatalog.hubs, key = { it.id }) { hub ->
                    val isSelected = state.selectedRegionId == hub.id
                    Surface(
                        shape = RoundedCornerShape(20.dp),
                        color = if (isSelected) hub.accent else Color.White.copy(alpha = 0.12f),
                        modifier = Modifier.clickable { vm.selectRegion(hub.id) }
                    ) {
                        Text(
                            text = if (hub.id == AtCatalog.ALL_INDIA) hub.name else "${hub.nativeName}  ${hub.name}",
                            color = Color.White,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 13.sp,
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                        )
                    }
                }
            }
        }

        items(sections, key = { it.id }) { playlist ->
            PlaylistCarousel(playlist, state.currentTrack?.id) { index -> vm.playQueue(playlist.tracks, index) }
        }
    }
}

@Composable
fun PlaylistCarousel(playlist: Playlist, currentTrackId: String?, onTrackClick: (Int) -> Unit) {
    Column(Modifier.padding(top = 24.dp)) {
        Text(
            playlist.title, color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(horizontal = 16.dp)
        )
        Text(playlist.subtitle, color = AtMuted, fontSize = 13.sp, modifier = Modifier.padding(horizontal = 16.dp))
        Spacer(Modifier.height(10.dp))
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            itemsIndexed(playlist.tracks, key = { _, track -> track.id }) { index, track ->
                TrackCard(track, isCurrent = track.id == currentTrackId) { onTrackClick(index) }
            }
        }
    }
}

@Composable
fun TrackCard(track: Track, isCurrent: Boolean, onClick: () -> Unit) {
    val region = AtCatalog.region(track.regionId)
    Column(Modifier.width(150.dp).clickable(onClick = onClick)) {
        Box {
            AsyncImage(
                model = track.artworkUrl,
                contentDescription = track.title,
                modifier = Modifier.size(150.dp).clip(RoundedCornerShape(12.dp)),
                contentScale = ContentScale.Crop
            )
            Text(
                region.nativeName,
                color = Color.White,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier
                    .padding(8.dp)
                    .clip(RoundedCornerShape(6.dp))
                    .background(region.accent)
                    .padding(horizontal = 6.dp, vertical = 2.dp)
            )
            if (isCurrent) {
                Icon(
                    Icons.Default.GraphicEq, contentDescription = "Now playing", tint = Color.White,
                    modifier = Modifier
                        .align(Alignment.BottomEnd)
                        .padding(8.dp)
                        .background(AtPink, CircleShape)
                        .padding(4.dp)
                )
            }
        }
        Spacer(Modifier.height(6.dp))
        Text(
            track.title, color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.SemiBold,
            maxLines = 1, overflow = TextOverflow.Ellipsis
        )
        Text(track.artist, color = AtMuted, fontSize = 12.sp, maxLines = 1)
    }
}

@Composable
fun MiniPlayer(state: AtMusicUiState, vm: AtMusicViewModel, modifier: Modifier = Modifier) {
    val track = state.currentTrack ?: return
    val background by animateColorAsState(state.albumColors.secondaryColor, tween(800), label = "miniBg")
    val progress = if (state.durationMs > 0) state.positionMs.toFloat() / state.durationMs else 0f

    Column(
        modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(background)
            .clickable { vm.setNowPlayingVisible(true) }
    ) {
        Row(Modifier.padding(8.dp), verticalAlignment = Alignment.CenterVertically) {
            AsyncImage(
                model = track.artworkUrl, contentDescription = null,
                modifier = Modifier.size(44.dp).clip(RoundedCornerShape(8.dp)),
                contentScale = ContentScale.Crop
            )
            Column(Modifier.weight(1f).padding(horizontal = 12.dp)) {
                Text(track.title, color = Color.White, fontWeight = FontWeight.SemiBold, maxLines = 1, overflow = TextOverflow.Ellipsis)
                Text(track.artist, color = Color.White.copy(alpha = 0.7f), fontSize = 12.sp, maxLines = 1)
            }
            IconButton(onClick = vm::togglePlayPause) {
                Icon(
                    if (state.isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                    contentDescription = "Play/Pause", tint = Color.White
                )
            }
            IconButton(onClick = vm::skipNext) {
                Icon(Icons.Default.SkipNext, contentDescription = "Next", tint = Color.White)
            }
        }
        LinearProgressIndicator(
            progress = { progress },
            modifier = Modifier.fillMaxWidth().height(2.dp),
            color = Color.White,
            trackColor = Color.White.copy(alpha = 0.2f)
        )
    }
}

// ==========================================
// 8. NOW PLAYING + SYNCED ROMANIZED LYRICS
// ==========================================
@Composable
fun NowPlayingScreen(state: AtMusicUiState, vm: AtMusicViewModel) {
    val track = state.currentTrack ?: return
    val region = AtCatalog.region(track.regionId)
    val primary by animateColorAsState(state.albumColors.primaryColor, tween(1000), label = "primary")
    val secondary by animateColorAsState(state.albumColors.secondaryColor, tween(1000), label = "secondary")
    var dragPosition by remember { mutableStateOf<Float?>(null) }
    val shownPosition = dragPosition?.toLong() ?: state.positionMs
    val isFavorite = track.id in state.favoriteIds

    Column(
        Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(primary, secondary, state.albumColors.tertiaryColor)))
            .systemBarsPadding()
            .padding(horizontal = 20.dp, vertical = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { vm.setNowPlayingVisible(false) }) {
                Icon(Icons.Default.KeyboardArrowDown, contentDescription = "Close", tint = Color.White, modifier = Modifier.size(32.dp))
            }
            Column(Modifier.weight(1f), horizontalAlignment = Alignment.CenterHorizontally) {
                Text("PLAYING FROM", color = Color.White.copy(alpha = 0.6f), fontSize = 11.sp)
                Text("${region.nativeName} · ${region.name}", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
            }
            Spacer(Modifier.size(48.dp))
        }

        Spacer(Modifier.height(16.dp))
        AsyncImage(
            model = track.artworkUrl,
            contentDescription = "Album artwork",
            modifier = Modifier.fillMaxWidth(0.82f).aspectRatio(1f).clip(RoundedCornerShape(16.dp)),
            contentScale = ContentScale.Crop
        )
        Spacer(Modifier.height(20.dp))

        Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                Text(track.title, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, color = Color.White, maxLines = 1)
                Text(track.artist, style = MaterialTheme.typography.bodyLarge, color = Color.White.copy(alpha = 0.7f), maxLines = 1)
            }
            IconButton(onClick = { vm.toggleFavorite(track.id) }) {
                Icon(
                    if (isFavorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                    contentDescription = "Favorite",
                    tint = if (isFavorite) AtPink else Color.White
                )
            }
        }

        Spacer(Modifier.height(12.dp))
        key(track.id) {
            SynchronizedLyricsView(track.lyrics, state.positionMs, Modifier.fillMaxWidth().weight(1f))
        }

        Slider(
            value = shownPosition.toFloat(),
            onValueChange = { dragPosition = it },
            onValueChangeFinished = {
                dragPosition?.let { vm.seekTo(it.toLong()) }
                dragPosition = null
            },
            valueRange = 0f..state.durationMs.coerceAtLeast(1L).toFloat(),
            colors = SliderDefaults.colors(
                thumbColor = Color.White,
                activeTrackColor = Color.White,
                inactiveTrackColor = Color.White.copy(alpha = 0.3f)
            )
        )
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(formatTime(shownPosition), color = Color.White.copy(alpha = 0.5f), fontSize = 12.sp)
            Text(formatTime(state.durationMs), color = Color.White.copy(alpha = 0.5f), fontSize = 12.sp)
        }

        Spacer(Modifier.height(8.dp))
        Row(
            Modifier.fillMaxWidth().padding(bottom = 8.dp),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = vm::toggleShuffle) {
                Icon(Icons.Default.Shuffle, contentDescription = "Shuffle", tint = if (state.shuffle) AtPink else Color.White.copy(alpha = 0.7f))
            }
            IconButton(onClick = vm::skipPrevious) {
                Icon(Icons.Default.SkipPrevious, contentDescription = "Previous", tint = Color.White, modifier = Modifier.size(36.dp))
            }
            IconButton(
                onClick = vm::togglePlayPause,
                modifier = Modifier.size(64.dp).background(Color.White, CircleShape)
            ) {
                Icon(
                    if (state.isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                    contentDescription = "Play/Pause", tint = Color.Black, modifier = Modifier.size(32.dp)
                )
            }
            IconButton(onClick = vm::skipNext) {
                Icon(Icons.Default.SkipNext, contentDescription = "Next", tint = Color.White, modifier = Modifier.size(36.dp))
            }
            IconButton(onClick = vm::cycleRepeat) {
                Icon(
                    if (state.repeatMode == Player.REPEAT_MODE_ONE) Icons.Default.RepeatOne else Icons.Default.Repeat,
                    contentDescription = "Repeat",
                    tint = if (state.repeatMode != Player.REPEAT_MODE_OFF) AtPink else Color.White.copy(alpha = 0.7f)
                )
            }
        }
    }
}

@Composable
fun SynchronizedLyricsView(lyrics: List<LyricLine>, positionMs: Long, modifier: Modifier = Modifier) {
    val listState = rememberLazyListState()
    val activeIndex = lyrics.indexOfLast { it.timeMs <= positionMs }

    LaunchedEffect(activeIndex) {
        if (activeIndex >= 0) listState.animateScrollToItem((activeIndex - 1).coerceAtLeast(0))
    }

    LazyColumn(
        state = listState,
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(14.dp),
        contentPadding = PaddingValues(vertical = 8.dp)
    ) {
        itemsIndexed(lyrics) { index, line ->
            val isActive = index == activeIndex
            val color by animateColorAsState(
                if (isActive) Color.White else Color.White.copy(alpha = if (index < activeIndex) 0.45f else 0.3f),
                tween(300),
                label = "lyric"
            )
            Text(
                text = line.text,
                color = color,
                fontSize = if (isActive) 24.sp else 19.sp,
                fontWeight = if (isActive) FontWeight.Bold else FontWeight.SemiBold,
                lineHeight = 30.sp
            )
        }
    }
}

fun formatTime(ms: Long): String {
    val totalSeconds = ms / 1000
    return String.format(Locale.US, "%d:%02d", totalSeconds / 60, totalSeconds % 60)
}
