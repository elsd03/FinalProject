import React, { useState } from "react";
import './App.css';
import Axios from "axios";
import styled from "styled-components";
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Picture from "./assets/food.svg";
import Search from "./assets/search-icon.svg";

const APP_ID = "a52b4d43";
const APP_KEY = "e0e5c667605f5e91d8275c973531b80a";

const RecipeContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 300px;
  box-shadow: 0 3px 10px 0 #aaa;
  text-align: center;
`;
const CoverImage = styled.img`
  object-fit: cover;
  height: 200px;
`;
const RecipeName = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: black;
  margin: 10px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-style: italic;
  text-align: center;
`;
const SeeMoreText = styled.span`
  background-color: black;
  font-size: 18px;
  text-align: center;
  border: solid 1px red;
  border-radius: 3px;
  padding: 10px 15px;
  cursor: pointer;
  color: white;
  font-weight: 700;
`;
const IngredientsText = styled(SeeMoreText)`
  color: white;
  border: solid 1px black;
  margin-bottom: 12px;
  background-color: red;
`;
const SeeNewTab = styled(SeeMoreText)`
  color: white;
  border: solid 1px red;
`;

const RecipeComponent = (props) => {
  const [show, setShow] = useState("");

  const { label, image, ingredients, url } = props.recipe;
  return (
    <RecipeContainer>
      <Dialog
        aria-labelledby="simple-dialog-title"
        open={show}
      >
        <DialogTitle>Ingredients</DialogTitle>
        <DialogContent>
          <RecipeName>{label}</RecipeName>
          <table>
            <thead>
              <th>Ingredient</th>
              <th>Weight</th>
            </thead>
            <tbody>
              {ingredients.map((ingredient, index) => (
                <tr key={index} className="ingredient-list">
                  <td>{ingredient.text}</td>
                  <td>{ingredient.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DialogContent>
        <DialogActions>
          <SeeNewTab onClick={() => window.open(url)}>See More</SeeNewTab>
          <SeeMoreText onClick={() => setShow("")}>Close</SeeMoreText>
        </DialogActions>
      </Dialog>
      <CoverImage src={image} alt={label} />
      <RecipeName>{label}</RecipeName>
      <IngredientsText onClick={() => setShow(!show)}>
        Ingredients
      </IngredientsText>
      <SeeMoreText onClick={() => window.open(url)}>
        Complete Recipe
      </SeeMoreText>
    </RecipeContainer>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const AppName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Header = styled.div`
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  font-size: 25px;
  font-weight: bold;
  box-shadow: 0 3px 6px 0 #555;
`;
const SearchBox = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding: 10px 10px;
  border-radius: 6px;
  margin-left: 20px;
  width: 50%;
  background-color: white;
`;
const SearchIcon = styled.img`
  width: 32px;
  height: 32px;
`;
const RecipeImage = styled.img`
  width: 36px;
  height: 36px;
  margin: 15px;
  background-color:white;
`;
const Placeholder = styled.img`
  width: 120px;
  height: 120px;
  margin: 200px;
  opacity: 50%;
`;
const SearchInput = styled.input`
  color: black;
  font-size: 16px;
  font-weight: bold;
  border: none;
  outline: none;
  margin-left: 15px;
`;
const RecipeListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 30px;
  gap: 20px;
  justify-content: space-evenly;
`;

const RemoveButton = styled.button`
  margin-right:10px;
  background: none;
  cursor: pointer;
  border: none;
  font-weight: 900;
  font-size:20px
`

const AppComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipeList, setRecipeList] = useState([]);
  const [timeoutId, setTimeoutId] = useState();
  const fetchData = async (searchString) => {
    const response = await Axios.get(
      `https://api.edamam.com/search?q=${searchString}&app_id=${APP_ID}&app_key=${APP_KEY}`,
    );
    setRecipeList(response.data.hits);
  };

  const onTextChange = (e) => {
    clearTimeout(timeoutId);
    setSearchQuery(e.target.value);
    const timeout = setTimeout(() => fetchData(e.target.value), 500);
    setTimeoutId(timeout);
  };

  const removeText = () => {
    setSearchQuery("")
    setRecipeList([])
  }

  return (
    <Container>
      <Header>
        <AppName>
          <RecipeImage src={Picture} />
          MEAL-RECIPE
        </AppName>
        <SearchBox>
          <SearchIcon src={Search} />
          <SearchInput
            placeholder="Search Recipe"
            value={searchQuery}
            onChange={onTextChange}
          />
          <RemoveButton onClick={removeText}>X</RemoveButton>
        </SearchBox>
      </Header>
      <RecipeListContainer>
        {recipeList?.length ? (
          recipeList.map((recipe, index) => (
            <RecipeComponent key={index} recipe={recipe.recipe} />
          ))
        ) : (          
          <Placeholder src={Picture} />
        )}
      </RecipeListContainer>
    </Container>
  );
};

export default AppComponent;