import type { IClock } from "@/application/ports";

export class SystemClock implements IClock {
  now() {
    return new Date();
  }
}
