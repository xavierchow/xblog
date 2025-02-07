export interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: string;
  weight: number;
  label: string;
}

export interface Link extends d3.SimulationLinkDatum<Node> {
  /* these two inherit from parent
  source: string;
  target: string;
   */
  value?: number;
}
export interface SimulatedLink extends d3.SimulationLinkDatum<Node> {
  source: Node;
  target: Node;
  value?: number;
}

export type Data = {
  nodes: Node[];
  links: Link[];
};
