import React, { useState, useRef, useEffect } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const SearchBar = ({
  search,
  clearSearch,
  selectedSearchOption,
  resetSearch,
  searchValue,
  setSearchValue,
}) => {
  // const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState(false);
  const prevSearchValue = useRef("");

  useEffect(() => {
    if (searchValue.length === 0 && prevSearchValue.current.length > 0) {
      clearSearch();
    }
    prevSearchValue.current = searchValue;
  }, [searchValue]);

  useEffect(() => {
    setSearchValue("");
  }, [resetSearch]);

  const isNumbers = (num) => /^[0-9\b]+$/.test(num);

  const handleSearchChange = (e) => {
    if (selectedSearchOption.type === "number") {
      if (isNumbers(e.target.value) || e.target.value === "") {
        setSearchValue(e.target.value);
        setError(false);
      } else {
        setError(true);
      }
    } else {
      setSearchValue(e.target.value);
      setError(false);
    }
  };

  const handleKeyPressed = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  const handleClearSearch = () => {
    setSearchValue("");
    clearSearch();
  };

  return (
    <TextField
      id="standard-basic"
      variant="outlined"
      placeholder="Search"
      size="small"
      error={error}
      value={searchValue}
      fullWidth
      onKeyDown={handleKeyPressed}
      onChange={(e) => handleSearchChange(e)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton onClick={() => search(searchValue)}>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: searchValue && (
          <IconButton onClick={handleClearSearch}>
            <ClearIcon sx={{ fontSize: 19 }} color="primary" />
          </IconButton>
        ),
      }}
    />
  );
};

export default SearchBar;
