import React from "react";
import {
  act,
  cleanup,
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import FarmStackProvider from "../../Components/Contexts/FarmStackContext";
import { BrowserRouter as Router } from "react-router-dom";
import GetStarted from "../../Views/GetStarted/GetStarted";
import "@testing-library/jest-dom/extend-expect";

describe("Get Started module", () => {
  beforeEach(() => cleanup());
  afterEach(() => cleanup());
  test("render Get started component sidebar", () => {
    render(
      <Router>
        <GetStarted />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
});
