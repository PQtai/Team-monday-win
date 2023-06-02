const routes = {
   // client
   home: '/',
   login: '/login',
   register: '/register/:verification',
   // private router
   board: '/board/:idBoard/workspace/:idWorkspace',
   workspace: '/workspace/:idWorkspace',
};

export default routes;
