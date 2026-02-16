import {create} from 'zustand';
const useDrawerStore = create((set) => ({
    drawerOpen: false,
    handleDrawerToggle: () => set((state) => ({ drawerOpen: !state.drawerOpen })),
}));
export default useDrawerStore;