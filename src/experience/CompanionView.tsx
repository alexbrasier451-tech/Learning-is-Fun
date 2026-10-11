import type { AudioStatus } from '../audio/controller';
import { assetUrl } from '../platform/assets';
import './creative.css';
import type { CreativeState } from './types';

export type CompanionViewProps = Readonly<{
  pose: 'idle' | 'help' | 'celebration';
  /** The adapter supplies only approved text whose required receipt is committed. */
  visibleGuidance: string;
  nextActivityLabel?: string;
  onRequestHint(): void;
  onChooseNext(): void;
  onRead(): void;
  onStopReading(): void;
  audioStatus: AudioStatus;
  /** Optional committed appearance; existing M1 callers remain compatible. */
  appearance?: CreativeState;
  /** Host supplies this only after an acknowledged supported success. */
  persistenceAcknowledgement?: string;
}>;

export function CompanionView({ pose, visibleGuidance, nextActivityLabel, onRequestHint,
  onChooseNext, onRead, onStopReading, audioStatus, appearance, persistenceAcknowledgement }: CompanionViewProps) {
  const canRead = audioStatus.preferences.soundEnabled && !audioStatus.preferences.silenceAll
    && audioStatus.activation === 'ready' && audioStatus.localVoiceAvailable && audioStatus.visible;
  return <aside className="pip-companion" aria-label="Pip's guidance">
    <div className={`pip-portrait pip-${pose}`}>
      <img src={assetUrl(`assets/art/m1/characters/pip-${pose}.svg`)} alt={`Pip, ${pose === 'help' ? 'ready to help' : pose === 'celebration' ? 'celebrating' : 'your companion'}`} width="300" height="320" />
      {appearance && <img className="pip-appearance" src={assetUrl(`assets/art/m1/props/scarf-${appearance.scarfColourId}.svg`)} alt="" />}
      {appearance?.scarfPatternId && ['scarf-leaf', 'scarf-star', 'scarf-wave'].includes(appearance.scarfPatternId) &&
        <img className="pip-appearance" src={assetUrl(`assets/art/${appearance.scarfPatternId === 'scarf-leaf' ? 'm1' : 'm2'}/props/${appearance.scarfPatternId}.svg`)} alt="" />}
    </div>
    <div className="pip-message">
      <p className="creative-eyebrow">A little help from Pip</p>
      <p className="pip-guidance" aria-live="polite" aria-atomic="true">{visibleGuidance}</p>
      {persistenceAcknowledgement && <p className="pip-persistence" role="status">{persistenceAcknowledgement}</p>}
      <div className="creative-actions">
        <button type="button" onClick={onRequestHint}>Ask Pip for a hint</button>
        <button type="button" onClick={onRead} disabled={!canRead || !visibleGuidance.trim()}>Read aloud</button>
        <button type="button" onClick={onStopReading} disabled={!audioStatus.speaking}>Stop reading</button>
      </div>
      {!canRead && <p className="creative-note">{audioStatus.preferences.silenceAll ? 'Sound is silenced. You can still read everything here.'
        : !audioStatus.preferences.soundEnabled ? 'Reading aloud is optional. Enable sound to use it.'
          : 'Reading aloud is unavailable here. The words stay on screen.'}</p>}
      {nextActivityLabel && <button className="creative-next" type="button" onClick={onChooseNext}>{nextActivityLabel} <span aria-hidden="true">→</span></button>}
    </div>
  </aside>;
}
