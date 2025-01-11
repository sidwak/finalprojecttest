//.d.ts files don't support enums
/* export interface nodeData {
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
} */

export interface NodeType {
  nodeName: string | null
  nodeType: string
  nodeData: DriverNodeType | VarNodeType | DomNodeType | AssertNodeType
  flow: {
    prevNodeId?: string
    nextNodeId?: string
  }
}

export interface DriverNodeType {
  cmd: {
    value: string
    isRequired: boolean
    isGetOnly: boolean
  }
  para1?: {
    value: string | null
    isRequired?: boolean
    isConnected: boolean
    connectedNodeId: string
    edgeId: string
  }
  para2?: {
    value: string | null
    isRequired?: boolean
    isConnected: boolean
    connectedNodeId: string
    edgeId: string
  }
}

export interface VarNodeType {
  para1: string
}

export interface DomNodeType {
  para1: string
}

export interface AssertNodeType {
  cmd: string
  para1: string
}

export interface flowNode {
  id: string
  type: string
  initialized: boolean
  position: [x: number, y: number]
  data: nodeData
}

//export type NodeType = 'dom-node' | 'var-node' | 'driver-node'
