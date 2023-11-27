/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useToast } from "../components/Toast";

const useLoading = (action, minDuration = 1000, navigateFunction) => {
    const [loading, setLoading] = useState(false);
    const toast= useToast();

    const handleAction = async (...args) => {
        try {
        setLoading(true);
        await action(...args);
        if (navigateFunction) {
            navigateFunction();
        }
        } catch (error) {
        console.error("Action failed");
        toast({
            title: 'Error',
            description: 'An error occurred during logging in',
            variant: 'error',
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
