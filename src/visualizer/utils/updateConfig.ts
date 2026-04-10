export function updateConfigValue<T extends object>(
    obj: T,
    path: string,
    value: unknown
  ): T {
    const keys = path.split(".");
  
    const newObj: any = { ...obj };
    let current: any = newObj;
  
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
  
      // clone each level
      current[key] = { ...current[key] };
      current = current[key];
    }
  
    current[keys[keys.length - 1]] = value;
  
    return newObj;
  }