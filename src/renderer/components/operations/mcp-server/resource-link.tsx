import { ResourceAction, Resources } from "@utils/enums";
import { useView } from "@context/viewProvider";
import { MCPServerBadge } from "./badge";

interface Props {
  connectionId: string;
  agentName?: string;
}

export const MCPConnectionResourceLink = ({ connectionId, agentName }: Props): JSX.Element => {
  const { setViewContext } = useView();

  return (
    <>
      <MCPServerBadge />
      <button
        className="text-blue-500 ml-2"
        onClick={() => setViewContext({
          resource: Resources.MCPServer,
          action: ResourceAction.Details,
          name: connectionId,
          namespace: undefined
        })}
      >
        {agentName || `Connection ${connectionId.substring(0, 8)}`}
      </button>
    </>
  );
};