import { useEffect, useState } from '@wordpress/element';
import { useDebounce } from '@wordpress/compose';

/**
 * @param {string} defaultValue 
 * @param {number} debounceMs 
 * @return {[string, (value: string) => void, string]} The input value, the setter and the debounced input value.
 */
export default function useDebouncedInputCustom(defaultValue = '', debounceMs = 250) {
    const [input, setInput] = useState(defaultValue);
    const [debouncedInput, setDebouncedState] = useState(defaultValue);

    const setDebouncedInput = useDebounce(setDebouncedState, debounceMs);

    useEffect(() => {
        setDebouncedInput(input);
    }, [input]);

    return [input, setInput, debouncedInput];
}
