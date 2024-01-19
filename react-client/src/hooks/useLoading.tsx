/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useToast } from "../components/Toast";

type ActionFunction = (...args: any[]) => Promise<void>;
type NavigateFunction = () => void;

interface UseLoadingOptions {
  minDuration?: number;
  navigateFunction?: NavigateFunction;
}

type UseLoadingReturn = [ActionFunction, boolean];

const useLoading = (
  action: ActionFunction,
  options: UseLoadingOptions = {}
): UseLoadingReturn => {
  const { minDuration = 1000, navigateFunction } = options;
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleAction: ActionFunction = async (...args) => {
    try {
      setLoading(true);
      await action(...args);
      if (navigateFunction) {
        navigateFunction();
      }
    } catch (error) {
      console.error("Action failed");
      toast({
        title: "Error",
        description: "An error occurred during the action",
        variant: "error",
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, minDuration);
    }
  };

  return [handleAction, loading];
};

export default useLoading;
