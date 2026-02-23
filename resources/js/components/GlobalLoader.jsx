import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function GlobalLoader() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let requestCount = 0;
        let timerId = null;

        const showLoader = () => {
            // Delay showing the loader by 300ms to prevent screen flickering 
            // on extremely fast Laravel API responses.
            timerId = setTimeout(() => {
                setIsLoading(true);
            }, 300);
        };

        const hideLoader = () => {
            clearTimeout(timerId);
            setIsLoading(false);
        };

        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                // Ensure we do not intercept simple background refresh calls if specified
                if (config.headers['X-No-Loader']) {
                    return config;
                }
                requestCount++;
                if (requestCount === 1) {
                    showLoader();
                }
                return config;
            },
            (error) => {
                requestCount = Math.max(0, requestCount - 1);
                if (requestCount === 0) hideLoader();
                return Promise.reject(error);
            }
        );

        const responseInterceptor = axios.interceptors.response.use(
            (response) => {
                if (!response.config.headers['X-No-Loader']) {
                    requestCount = Math.max(0, requestCount - 1);
                    if (requestCount === 0) hideLoader();
                }
                return response;
            },
            (error) => {
                if (error.config && !error.config.headers['X-No-Loader']) {
                    requestCount = Math.max(0, requestCount - 1);
                    if (requestCount === 0) hideLoader();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            clearTimeout(timerId);
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
            <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center transform scale-100 transition-transform pointer-events-auto">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
                <p className="text-gray-700 font-semibold">Processing...</p>
            </div>
        </div>
    );
}
