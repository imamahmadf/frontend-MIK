"use client";

import { ReactNode, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { initializeAuth } from "@/store/authSlice";

export function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return <>{children}</>;
}
