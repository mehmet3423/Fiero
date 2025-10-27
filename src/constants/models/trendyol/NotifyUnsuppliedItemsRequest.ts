export interface NotifyUnsuppliedItemsRequest {
  lines: UnsuppliedLine[];
  reasonId: number;
}

export interface UnsuppliedLine {
  lineId: number;
  quantity: number;
}