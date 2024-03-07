import React, { useEffect, useRef } from "react";

const useEffectSkipInitialRender = (
    callback: () => void | (() => void | undefined),
    dataArr: React.DependencyList | undefined
) => {
    const isInitialRender = useRef(true);

    useEffect(() => {
        if (isInitialRender.current) {
            // skip initial execution of useEffect
            isInitialRender.current = false;
            return;
        }
        return callback();
    }, dataArr);
};

export default useEffectSkipInitialRender;
