import { FingerType } from "../values/FingerType";

export type Room = {
    id: string;
    fingerType: FingerType;
    sessionIds: string[];
}
