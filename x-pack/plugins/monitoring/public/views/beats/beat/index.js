/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { find } from 'lodash';
import { i18n } from '@kbn/i18n';
import { uiRoutes } from '../../../angular/helpers/routes';
import { routeInitProvider } from '../../../lib/route_init';
import { MonitoringViewBaseController } from '../../';
import { getPageData } from './get_page_data';
import template from './index.html';
import { CODE_PATH_BEATS } from '../../../../common/constants';

uiRoutes.when('/beats/beat/:beatUuid', {
  template,
  resolve: {
    clusters: function (Private) {
      const routeInit = Private(routeInitProvider);
      return routeInit({ codePaths: [CODE_PATH_BEATS] });
    },
    pageData: getPageData,
  },
  controllerAs: 'beat',
  controller: class BeatDetail extends MonitoringViewBaseController {
    constructor($injector, $scope) {
      // breadcrumbs + page title
      const $route = $injector.get('$route');
      const globalState = $injector.get('globalState');
      $scope.cluster = find($route.current.locals.clusters, {
        cluster_uuid: globalState.cluster_uuid,
      });

      const pageData = $route.current.locals.pageData;
      super({
        title: i18n.translate('xpack.monitoring.beats.instance.routeTitle', {
          defaultMessage: 'Beats - {instanceName} - Overview',
          values: {
            instanceName: pageData.summary.name,
          },
        }),
        getPageData,
        $scope,
        $injector,
      });

      this.data = pageData;
    }
  },
});
