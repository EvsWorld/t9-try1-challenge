import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  Container, Row, Col,
  Card,
  CardTitle,
  CardBody,
  CardImg
} from 'reactstrap';

import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
  Cards,
} from '@coreui/react';

// import DefaultAside from './DefaultAside';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';
// import Example from '../../views/Example';

class DefaultLayout extends Component {
  render() {
    return (
      <div className="app">
        {/* <AppHeader fixed>
          <DefaultHeader />
        </AppHeader> */}
        {/* <div className="app-body"> */}
          {/* <main className="main"> */}
            {/* <Example color='primary'/> */}
            <Container>
              <Row>
                <Card >
                  <CardBody>
                    <CardImg src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"/>
                    <CardTitle>Card Title 1</CardTitle>
                  </CardBody>
                </Card>
                <Card >
                  <CardBody>
                    <CardImg src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"/>
                    <CardTitle>Card Title 2</CardTitle>
                  </CardBody>
                </Card>
              </Row>
            </Container>
            {/* <Container fluid>
              <Switch>
                {routes.map((route, idx) => {
                    return route.component ? (<Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                        <route.component {...props} />
                      )} />)
                      : (null);
                  },
                )}
                <Redirect from="/" to="/dashboard" />
              </Switch>
            </Container> */}
          {/* </main> */}
        {/* </div> */}
        <AppFooter>
          <DefaultFooter />
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
