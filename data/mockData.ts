import type { Media, Collection } from '../types';

const generateMediaItem = (id: string, title: string, type: 'movie' | 'tv-show', year: number, rating: number, poster: string, hero: string, genres: string[]): Media => ({
  _id: id,
  tmdbId: `tmdb-${id}`,
  title,
  type,
  releaseYear: year,
  synopsis: `This is a compelling synopsis for ${title}. It involves drama, action, and high stakes, keeping viewers on the edge of their seats. The journey of the protagonists is fraught with peril and excitement.`,
  posterImageUrl: poster,
  heroImageUrl: hero,
  genres,
  rating,
  cast: [
    { actorName: 'Actor One', characterName: 'Character A', profileImageUrl: 'https://i.pravatar.cc/150?img=1' },
    { actorName: 'Actor Two', characterName: 'Character B', profileImageUrl: 'https://i.pravatar.cc/150?img=2' },
    { actorName: 'Actor Three', characterName: 'Character C', profileImageUrl: 'https://i.pravatar.cc/150?img=3' },
    { actorName: 'Actor Four', characterName: 'Character D', profileImageUrl: 'https://i.pravatar.cc/150?img=4' },
    { actorName: 'Actor Five', characterName: 'Character E', profileImageUrl: 'https://i.pravatar.cc/150?img=5' },
  ],
  videoSources: [
    { quality: '1080p', url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4', format: 'mp4', sourceDomain: 'test-videos.co.uk', sourceUploadedBy: 'Admin' },
    { quality: '720p', url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4', format: 'mp4', sourceDomain: 'test-videos.co.uk', sourceUploadedBy: 'Admin' },
  ],
  seasons: type === 'tv-show' ? [
    {
      seasonNumber: 1,
      episodes: Array.from({ length: 10 }, (_, i) => ({
        episodeNumber: i + 1,
        title: `Episode ${i + 1}`,
        synopsis: `Synopsis for S01E${i + 1} of ${title}.`,
        videoSources: [{ quality: '1080p', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', format: 'mp4', sourceDomain: 'googleapis.com', sourceUploadedBy: 'Admin' }]
      }))
    },
    {
      seasonNumber: 2,
      episodes: Array.from({ length: 8 }, (_, i) => ({
        episodeNumber: i + 1,
        title: `Episode ${i + 1}`,
        synopsis: `Synopsis for S02E${i + 1} of ${title}.`,
        videoSources: [{ quality: '1080p', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', format: 'mp4', sourceDomain: 'googleapis.com', sourceUploadedBy: 'Admin' }]
      }))
    }
  ] : [],
});

const allMediaItems: Media[] = [
    generateMediaItem('1', 'The Final Frontier', 'movie', 2024, 8.5, '/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg', '/5aVJULyd9q1g1zl2iAnc0P6b8ae.jpg', ['Sci-Fi', 'Action']),
    generateMediaItem('2', 'Cyber City Stories', 'tv-show', 2023, 9.2, '/y28ckLdL2s1J2i1a5H9p7k3n8b4.jpg', '/84594y28ckLd1J2i1a5H9p7k3n8b4.jpg', ['Cyberpunk', 'Drama', 'Thriller']),
    generateMediaItem('3', 'Ocean\'s Depths', 'movie', 2022, 7.8, '/uS1A9p7k3n8b4y28ckLd1J2i1a5H9.jpg', '/A9p7k3n8b4y28ckLd1J2i1a5H9uS1.jpg', ['Adventure', 'Documentary']),
    generateMediaItem('4', 'Kings of the Air', 'tv-show', 2024, 8.8, '/dCqcr5d8zH5A9p7k3n8b4y28ckLd1.jpg', '/cr5d8zH5A9p7k3n8b4y28ckLd1dCq.jpg', ['War', 'Drama', 'History']),
    generateMediaItem('5', 'Forgotten Kingdom', 'movie', 2021, 8.1, '/k3n8b4y28ckLd1J2i1a5H9p7S1A9p.jpg', '/n8b4y28ckLd1J2i1a5H9p7S1A9pk3.jpg', ['Fantasy', 'Adventure']),
    generateMediaItem('6', 'The Last Stand', 'movie', 2023, 7.9, '/A9pS1k3n8b4y28ckLd1J2i1a5H9p7.jpg', '/pS1k3n8b4y28ckLd1J2i1a5H9p7A9.jpg', ['Action', 'Thriller']),
    generateMediaItem('7', 'Echoes of Time', 'tv-show', 2022, 9.0, '/n8b4y28ckLd1J2i1a5H9p7A9pS1k3.jpg', '/b4y28ckLd1J2i1a5H9p7A9pS1k3n8.jpg', ['Sci-Fi', 'Mystery']),
    generateMediaItem('8', 'Culinary Masters', 'tv-show', 2024, 8.4, '/y28ckLd1J2i1a5H9p7A9pS1k3n8b4.jpg', '/28ckLd1J2i1a5H9p7A9pS1k3n8b4y.jpg', ['Reality']),
    generateMediaItem('9', 'Project Chimera', 'movie', 2024, 8.7, '/Ld1J2i1a5H9p7A9pS1k3n8b4y28ck.jpg', '/d1J2i1a5H9p7A9pS1k3n8b4y28ckL.jpg', ['Sci-Fi', 'Horror', 'Thriller']),
    generateMediaItem('10', 'Good Omens', 'tv-show', 2019, 8.5, '/5kfYLH_l2v326N9hI2d9yHwARGw.jpg', '/ TaitS1oYz2z2T8H5K1i3M0fP491.jpg', ['Comedy', 'Fantasy']),
    generateMediaItem('11', 'The Witcher', 'tv-show', 2019, 8.1, '/7vjaCdE33wSx47dGbe2i41z3aAA.jpg', '/foGkMAian1l71ADoE6i2i0a1n6A.jpg', ['Action', 'Adventure', 'Fantasy']),
    generateMediaItem('12', 'The Boys', 'tv-show', 2019, 8.7, '/2zmTngn1tJ9p5PaBf6gH6mbXWzN.jpg', '/o0s403ED1sP13nS2n22Ie45vY8G.jpg', ['Action', 'Comedy', 'Sci-Fi']),
    generateMediaItem('13', 'Dune: Part Two', 'movie', 2024, 8.3, '/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg', '/xOMo8BRK7PfcJv9JCnx7s5NJgv4.jpg', ['Sci-Fi', 'Adventure']),
    generateMediaItem('14', 'Oppenheimer', 'movie', 2023, 8.6, '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', '/rVJfabCz13qhebAcmHVWemvj5sE.jpg', ['Drama', 'History']),
    generateMediaItem('15', 'Shōgun', 'tv-show', 2024, 8.7, '/7O4iVf5vQayp015M2iV2Ea9Ua3f.jpg', '/AbRYhdeN922iUdM0tVlC3edWd5S.jpg', ['Drama', 'War', 'History']),
    generateMediaItem('16', 'Fallout', 'tv-show', 2024, 8.5, '/AnsSKAU1Y6263jY5A7p6Gk6sBYb.jpg', '/fS4i7nL2aD4wD9rLVb2VdYeC3w.jpg', ['Sci-Fi', 'Action', 'Adventure']),
    // Horror & Thriller
    generateMediaItem('17', 'The Exorcist: Believer', 'movie', 2023, 6.1, '/qVKir3ovE5Mkl3GVXpXD1w2DEYa.jpg', '/2GgvZES2weVdsF2Ais7V1nwe3jJ.jpg', ['Horror']),
    generateMediaItem('18', 'The Nun II', 'movie', 2023, 6.8, '/nmPzG11W6S2rQxTJW22sDsZgcbA.jpg', '/5gzzkR7y3hnY8AD1wXjCnVlHba5.jpg', ['Horror', 'Mystery', 'Thriller']),
    generateMediaItem('19', 'A Quiet Place Part II', 'movie', 2021, 7.5, '/4q2hz2m8hubgvijz8Ez0T2Os2Yv.jpg', '/IobNcmaGcF4p9gM96Nl3s1a4Hh.jpg', ['Sci-Fi', 'Horror', 'Thriller']),
    generateMediaItem('20', 'Smile', 'movie', 2022, 6.8, '/aPqcQwu4VGEqUYhaAaNC2B6iAlF.jpg', '/kK4ZJ9yTf5tMA2a5iV23pGf3aCI.jpg', ['Horror', 'Mystery']),
    generateMediaItem('21', 'Amateur', 'movie', 2018, 6.5, '/Ao44Y33sFTrL2iV5ue13hA2r2a.jpg', '/qf7cM9sC4sOlIv9F2BUIpILm9a.jpg', ['Drama', 'Sport']),
    // Romance
    generateMediaItem('22', 'Anyone But You', 'movie', 2023, 7.1, '/yRt7MGBElASRfg75VptLAbW8bG8.jpg', '/d2d2n8nS2q95tso2lA2OKa8l2na.jpg', ['Comedy', 'Romance']),
    generateMediaItem('23', 'My Fault', 'movie', 2023, 8.0, '/w46Vw536HwNn8g2b1Lde0PAT0S.jpg', '/r2y3lA2OKa8l2na5a4BP2a8N7Ws.jpg', ['Romance', 'Drama']),
    generateMediaItem('24', 'XO, Kitty', 'tv-show', 2023, 7.8, '/tYgCcs4aA8rC5zJv6SEV4A50xZ.jpg', '/Ag3D4bbfAPkg4g2b1Lde0PAT0Sj.jpg', ['Romance', 'Comedy', 'Drama']),
    generateMediaItem('25', 'The Idea of You', 'movie', 2024, 7.4, '/zDi2U2d36y6Yome1i2G3sA8Ea4.jpg', '/3sA8Ea4zDi2U2d36y6Yome1i2G.jpg', ['Romance', 'Comedy', 'Drama']),
    // African & Black Cinema
    generateMediaItem('26', 'The Chi', 'tv-show', 2018, 8.2, '/l2na5a4BP2a8N7Wszs2lA2OKa8.jpg', '/y6Yome1i2G3sA8Ea4zDi2U2d36.jpg', ['Drama']),
    generateMediaItem('27', 'Kings of Jo\'burg', 'tv-show', 2020, 7.9, '/pZcaXWqe2t3nS3A7syI3XoQWzJ.jpg', '/zJv6SEV4A50xZAg3D4bbfAPkg4g.jpg', ['Crime', 'Drama', 'Thriller']),
    generateMediaItem('28', 'Shaka iLembe', 'tv-show', 2023, 8.8, '/gBw06i9T202s53Of2224W0p7k2O.jpg', '/de0PAT0Sjw46Vw536HwNn8g2b1L.jpg', ['Drama', 'History']),
    generateMediaItem('29', 'Black Panther', 'movie', 2018, 7.4, '/uxzzxijgPIY7slzFvMotPv8wjA5.jpg', '/bC0zm23r52gJCk1N8oB32Wv3Ehy.jpg', ['Action', 'Adventure', 'Sci-Fi']),
    generateMediaItem('30', 'A Tribe Called Judah', 'movie', 2023, 7.1, '/jIywj3kGG7CH4X41s24p99S3QLf.jpg', '/s5zJv6SEV4A50xZAg3D4bbfAPkg.jpg', ['Comedy']),
];


const mediaDetailsMap: Record<string, Media> = allMediaItems.reduce((acc, media) => {
    acc[media._id] = media;
    return acc;
}, {} as Record<string, Media>);


const homepageData: Collection[] = [
    {
        _id: 'col1',
        title: 'Trending Now 🔥',
        slug: 'trending-now',
        items: [mediaDetailsMap['13'], mediaDetailsMap['15'], mediaDetailsMap['4'], mediaDetailsMap['16'], mediaDetailsMap['9'], mediaDetailsMap['6'], mediaDetailsMap['11'], mediaDetailsMap['12']]
    },
    {
        _id: 'col2',
        title: 'HOT Action Movies',
        slug: 'hot-action-movies',
        items: [mediaDetailsMap['6'], mediaDetailsMap['1'], mediaDetailsMap['13'], mediaDetailsMap['9'], mediaDetailsMap['14']]
    },
    {
        _id: 'col3',
        title: 'Critically Acclaimed TV',
        slug: 'critically-acclaimed-tv',
        items: [mediaDetailsMap['2'], mediaDetailsMap['4'], mediaDetailsMap['7'], mediaDetailsMap['15'], mediaDetailsMap['12'], mediaDetailsMap['16'], mediaDetailsMap['10'], mediaDetailsMap['11']]
    },
     {
        _id: 'col4',
        title: 'Sci-Fi Worlds',
        slug: 'sci-fi-worlds',
        items: [mediaDetailsMap['1'], mediaDetailsMap['7'], mediaDetailsMap['9'], mediaDetailsMap['13'], mediaDetailsMap['16'], mediaDetailsMap['12']]
    },
    {
        _id: 'col5',
        title: 'Midnight Horror Express 🔪',
        slug: 'midnight-horror-express',
        items: [mediaDetailsMap['17'], mediaDetailsMap['18'], mediaDetailsMap['19'], mediaDetailsMap['20'], mediaDetailsMap['9']]
    },
    {
        _id: 'col6',
        title: 'Romantic Love ❤️',
        slug: 'romantic-love',
        items: [mediaDetailsMap['22'], mediaDetailsMap['23'], mediaDetailsMap['24'], mediaDetailsMap['25'], mediaDetailsMap['10']]
    },
    {
        _id: 'col7',
        title: 'Must-watch Black Shows',
        slug: 'must-watch-black-shows',
        items: [mediaDetailsMap['26'], mediaDetailsMap['27'], mediaDetailsMap['28'], mediaDetailsMap['12'], mediaDetailsMap['29']]
    },
    {
        _id: 'col8',
        title: 'Made in Africa',
        slug: 'made-in-africa',
        items: [mediaDetailsMap['30'], mediaDetailsMap['27'], mediaDetailsMap['28']]
    },
];

const browseableMedia = [...allMediaItems].sort((a,b) => b.releaseYear - a.releaseYear);

export { homepageData, mediaDetailsMap, browseableMedia };
