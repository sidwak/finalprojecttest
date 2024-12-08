export default interface nodeData {
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
  }
  pCmd?: {
    value: string
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
