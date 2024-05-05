import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/auth', component: '@/pages/auth/index' },
    { path: '/register', component: '@/pages/register/index' },
  ],
  fastRefresh: {},
});
