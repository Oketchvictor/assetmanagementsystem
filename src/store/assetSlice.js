import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import assetService from '../services/assetService';

// Async thunks
export const fetchAssets = createAsyncThunk(
  'assets/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await assetService.getAllAssets(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAsset = createAsyncThunk(
  'assets/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await assetService.getAsset(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createAsset = createAsyncThunk(
  'assets/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await assetService.createAsset(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateAsset = createAsyncThunk(
  'assets/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await assetService.updateAsset(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAsset = createAsyncThunk(
  'assets/delete',
  async (id, { rejectWithValue }) => {
    try {
      await assetService.deleteAsset(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  'assets/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await assetService.getDashboardStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const globalSearch = createAsyncThunk(
  'assets/search',
  async (query, { rejectWithValue }) => {
    try {
      const response = await assetService.globalSearch(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  items: [],
  currentAsset: null,
  dashboardStats: null,
  searchResults: [],
  loading: false,
  error: null,
  filters: {
    category: null,
    status: null,
    location: null,
    search: '',
  },
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
  },
};

// Slice
const assetSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentAsset: (state, action) => {
      state.currentAsset = action.payload;
    },
    clearCurrentAsset: (state) => {
      state.currentAsset = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all assets
      .addCase(fetchAssets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.results || action.payload;
        state.pagination.total = action.payload.count || action.payload.length;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single asset
      .addCase(fetchAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAsset.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAsset = action.payload;
      })
      .addCase(fetchAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create asset
      .addCase(createAsset.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      
      // Update asset
      .addCase(updateAsset.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentAsset?.id === action.payload.id) {
          state.currentAsset = action.payload;
        }
      })
      
      // Delete asset
      .addCase(deleteAsset.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.currentAsset?.id === action.payload) {
          state.currentAsset = null;
        }
      })
      
      // Dashboard stats
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardStats = action.payload;
      })
      
      // Global search
      .addCase(globalSearch.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      });
  },
});

export const { 
  setFilters, 
  clearFilters, 
  setCurrentAsset, 
  clearCurrentAsset,
  clearSearchResults 
} = assetSlice.actions;

export default assetSlice.reducer;