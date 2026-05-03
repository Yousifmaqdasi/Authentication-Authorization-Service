import { PERMISSIONS } from "../config/permissions";

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
