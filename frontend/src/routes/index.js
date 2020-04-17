import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '~/pages/SignIn';
import DeliveriesList from '~/pages/Deliveries/DeliveriesList';
import DeliveryForm from '~/pages/Deliveries/DeliveryForm';

import DeliverymenList from '~/pages/Deliverymen/DeliverymenList';
import DeliverymanForm from '~/pages/Deliverymen/DeliverymanForm';

import RecipientsList from '~/pages/Recipients/RecipientsList';
import RecipientForm from '~/pages/Recipients/RecipientForm';

import Problems from '~/pages/Problems';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" component={SignIn} exact />

      <Route path="/dashboard" component={DeliveriesList} isPrivate />
      <Route path="/deliveries/create" component={DeliveryForm} isPrivate />
      <Route path="/deliveries/:id" component={DeliveryForm} isPrivate />
      <Route path="/deliveries" component={DeliveriesList} isPrivate />

      <Route path="/deliverymen/create" component={DeliverymanForm} isPrivate />
      <Route path="/deliverymen/:id" component={DeliverymanForm} isPrivate />
      <Route path="/deliverymen" component={DeliverymenList} isPrivate />

      <Route path="/recipients/create" component={RecipientForm} isPrivate />
      <Route path="/recipients/:id" component={RecipientForm} isPrivate />
      <Route path="/recipients" component={RecipientsList} isPrivate />

      <Route path="/problems" component={Problems} exact isPrivate />
    </Switch>
  );
}
