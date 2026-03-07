import { Close, Search } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";

// ─── Uso ───────────────────────────────────────────────────────────────────────
// <AppSearchInput
//   value={search}
//   onChange={(val) => setSearch(val)}
//   placeholder="Buscar por nombre..."
// />
const AppSearchInput = ({
  value,
  onChange,
  placeholder = "Buscar...",
  width = 280,
}) => (
  <TextField
    size="small"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    sx={{ width }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Search fontSize="small" color="action" />
        </InputAdornment>
      ),
      endAdornment: value ? (
        <InputAdornment position="end">
          <Close
            fontSize="small"
            color="action"
            sx={{ cursor: "pointer" }}
            onClick={() => onChange("")}
          />
        </InputAdornment>
      ) : null,
    }}
  />
);

export default AppSearchInput;
