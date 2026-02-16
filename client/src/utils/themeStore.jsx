import {create} from 'zustand';

"theme ui for dark and light mode"

const useThemeStore= create((set) =>({
    darkMode : false,
    setDarkMode: (darkMode) => set({ darkMode }),
    toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}))
export default useThemeStore;