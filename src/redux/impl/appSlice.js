import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    loaded: false,
    streams: [],
    activeChat: null,
    collapsedLeftBar: false,
    hoveredLeftTab: false,
    collapsedRightBar: false,
    hoveredRightTab: false,
    searchValue: '',
    open: false,
    selectedToDelete: false,
  },
  reducers: {
    collapseLeftBar: (state, action) => {
      state.collapsedLeftBar = action.payload
    },
    hoverLeftTab: (state, action) => {
      state.hoveredLeftTab = action.payload
    },
    collapseRightBar: (state, action) => {  
      state.collapsedRightBar = action.payload
    },
    hoverRightTab: (state, action) => {
      state.hoveredRightTab = action.payload
    },
    setStreams: (state, action) => {
      state.streams = action.payload
    },
    setActiveChat: (state, action) => { 
      state.activeChat = action.payload
    },
    setLoaded: (state, action) => {
      state.loaded = action.payload
    },
    setSearch: (state, action) => { 
      state.searchValue = action.payload
    },
    setOpen: (state, action) => { 
      state.open = action.payload
    },
    setSelectedToDelete: (state, action) => { 
      state.selectedToDelete = action.payload
    }
  },
})

export const { 
  setLoaded,
  setStreams, 
  setActiveChat, 
  collapseLeftBar,
  hoverLeftTab,
  collapseRightBar,
  hoverRightTab,
  setSearch,
  setOpen,
  setSelectedToDelete
} = appSlice.actions

export default appSlice.reducer