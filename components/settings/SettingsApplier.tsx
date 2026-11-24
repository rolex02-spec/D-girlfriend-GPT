"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/store/settingsStore";

export function SettingsApplier() {
  const { applyAll } = useSettingsStore();
  
  useEffect(() => {
    applyAll();
  }, [applyAll]);
  
  return null;
}