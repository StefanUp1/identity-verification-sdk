import { useRestartDemoFlow } from "../hooks/useRestartDemoFlow";

type Props = {
  /** Runs before cart/verification clear (e.g. reset page-local state on Browse). */
  onBeforeRestart?: () => void;
};

export function RestartDemoFlow({ onBeforeRestart }: Props) {
  const restart = useRestartDemoFlow();

  return (
    <div className="demo-restart-footer">
      <button
        type="button"
        className="demo-restart"
        onClick={() => {
          onBeforeRestart?.();
          restart();
        }}
      >
        Leave and start over
      </button>
    </div>
  );
}
