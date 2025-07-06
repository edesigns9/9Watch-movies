
import React, { useState } from 'react';
import type { Season } from '../types';

interface EpisodeSelectorProps {
  seasons: Season[];
  onEpisodeSelect: (url: string, seasonNumber: number, episodeNumber: number) => void;
  initialSeason: number;
  initialEpisode: number;
}

const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({ seasons, onEpisodeSelect, initialSeason, initialEpisode }) => {
  const [selectedSeason, setSelectedSeason] = useState<number>(initialSeason);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(initialEpisode);

  const activeSeason = seasons.find(s => s.seasonNumber === selectedSeason);

  const handleEpisodeClick = (episodeNumber: number, url: string) => {
    setSelectedEpisode(episodeNumber);
    onEpisodeSelect(url, selectedSeason, episodeNumber);
  };

  const handleSeasonClick = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    // When season changes, select the first episode of that season by default
    const firstEpisode = seasons.find(s => s.seasonNumber === seasonNumber)?.episodes[0];
    if (firstEpisode) {
        handleEpisodeClick(firstEpisode.episodeNumber, firstEpisode.videoSources[0].url);
    }
  }
  
  return (
    <div className="w-96 bg-brand-surface flex flex-col h-full flex-shrink-0">
      <div className="p-4 border-b border-brand-surface-2">
        <h3 className="text-xl font-bold">Resources</h3>
      </div>
      <div className="p-4 flex flex-wrap gap-2 border-b border-brand-surface-2">
        {seasons.map(season => (
          <button
            key={season.seasonNumber}
            onClick={() => handleSeasonClick(season.seasonNumber)}
            className={`px-4 py-1.5 text-sm rounded ${selectedSeason === season.seasonNumber ? 'bg-brand-primary text-white' : 'bg-brand-surface-2 text-brand-text-dim hover:bg-opacity-80'}`}
          >
            S{String(season.seasonNumber).padStart(2, '0')}
          </button>
        ))}
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        <div className="grid grid-cols-5 gap-2">
          {activeSeason?.episodes.map(ep => (
            <button
              key={ep.episodeNumber}
              onClick={() => handleEpisodeClick(ep.episodeNumber, ep.videoSources[0].url)}
              className={`aspect-square flex items-center justify-center rounded ${selectedEpisode === ep.episodeNumber && selectedSeason === activeSeason.seasonNumber ? 'bg-green-600 text-white' : 'bg-brand-surface-2 text-brand-text-dim hover:bg-opacity-80'}`}
            >
              {String(ep.episodeNumber).padStart(2, '0')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EpisodeSelector;
