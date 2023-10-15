import React from 'react';
import { Suspense, lazt } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const KeysToComponentMap = {
  sample1: React.lazy(() => import('remoteApp/Sample1')),
  sample2: React.lazy(() => import('remoteApp/Sample2')),
  sample3: React.lazy(() => import('remoteApp/Sample3')),
};

// const dynamicKeysToComponentMap = { navigation.map(nav => [nav.name] :  React.lazy(()=> import('remoteApp/' + nav.name)) }

function remotePageRenderer(componentName) {
  if (typeof KeysToComponentMap[componentName.toLowerCase()] !== 'undefined') {
    return (
      <ErrorBoundary fallback={<>Oops,we cant load that page right now :( </>}>
        <Suspense fallback="loading....">
          {React.createElement(KeysToComponentMap[componentName.toLowerCase()])}
        </Suspense>
      </ErrorBoundary>
    );
  }
}

export default remotePageRenderer;
