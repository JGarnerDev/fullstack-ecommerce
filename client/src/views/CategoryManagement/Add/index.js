import React, { useReducer } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import {
  addCategoryReducer,
  addCategoryInitialState,
} from "../../../store/AddCategory";

import { ADD_CATEGORY_ROUTE } from "../../../config";

import Layout from "../../../hoc/Layout";
import FormField from "../../../components/FormField";
import UIMessage from "../../../components/UIMessage";

import { Button } from "@material-ui/core";

import "./Add.scss";

const AddCategory = () => {
  const [state, dispatch] = useReducer(
    addCategoryReducer,
    addCategoryInitialState
  );

  const { Name, Error, RenderError, Loading, Success } = state;

  if (Success) {
    return <Redirect to="/" />;
  }

  const attemptNewCategory = (name) => {
    axios
      .post(`${ADD_CATEGORY_ROUTE}`, { name })
      .then(() => {
        dispatch({ type: "success" });
      })
      .catch((error) => {
        dispatch({ type: "error", value: error.response.data.error });
      });
  };

  let timeout;

  const submit = async (e) => {
    e.preventDefault();
    dispatch({ type: "clearError" });
    dispatch({ type: "loading" });
    if (timeout) {
      clearTimeout(timeout);
    }
    await attemptNewCategory(Name);
    dispatch({ type: "loadComplete" });
    timeout = setTimeout(() => {
      dispatch({ type: "clearError" });
    }, 2000);
  };

  const renderForm = () => {
    return (
      <form id="AddCategory__wrapper__form">
        <FormField
          label="Category name"
          value={Name}
          required={true}
          changeHandler={(e) =>
            dispatch({
              type: "fieldChange",
              field: "Name",
              value: e.currentTarget.value,
            })
          }
        />
        <Button variant="contained" color="primary" onClick={submit}>
          Add new category
        </Button>
        {Loading ? <p>FICK</p> : null}
        {RenderError ? <UIMessage message={Error} type="error" /> : null}
        {Success ? <UIMessage message={Success} type="success" /> : null}
      </form>
    );
  };

  return (
    <Layout
      title="Add a Product Category"
      description="Pick a category name for new products"
      page="AddCategory"
    >
      <div id="AddCategory__wrapper">{renderForm()}</div>
    </Layout>
  );
};

export default AddCategory;
