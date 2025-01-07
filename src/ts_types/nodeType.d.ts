export interface nodeData {
  label: string
  reqNodeName?: boolean
  nodeName: string | null
  nodeType: string
  pValue: {
    isRequired?: boolean
    isConnected: boolean
    isRuntime: boolean
    connnectedNodeId: string
    value: string | null
    edgeId: string
  }
  pCmd?: {
    value: string
    isValueRequired?: boolean
    isGetOnly?: boolean
  }
  flow: {
    prevNodeId?: string
    nextNodeId?: string
  }
}

export enum nodeType {
  DriverNode = 'driver-node',
  VarNode = 'var-node',
  DomNode = 'dom-node',
}
