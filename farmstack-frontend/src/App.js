import React, { lazy, Suspense } from "react";
import "mdbreact/dist/css/mdb.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Loader from "common/components/Loader";
import ScrollToTop from "common/components/ScrollToTop";
import featureRoutes from "features/routes";
import { Helmet } from "react-helmet";
import { getMetaData } from "common/utils/MetaData";
const MainComponent = lazy(() => Promise.resolve({ default: featureRoutes }));
const instance = process.env.REACT_APP_INSTANCE;

function App() {
  const { title, description, faviconImage } = getMetaData(instance);
  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" type="image/x-icon" href={faviconImage} />
      </Helmet>
      <Suspense fallback={<Loader />}>
        <Router>
          <ScrollToTop />
          <Switch>
            <Route path="/" component={MainComponent} />
          </Switch>
        </Router>
      </Suspense>
    </React.Fragment>
  );
}

export default App;
