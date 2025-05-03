import { useSelector } from "react-redux"
import { Outlet,Navigate } from "react-router-dom";
//outlet -means children
//if currentUser exists then we show outlet(children-dashboard) else we'll navigate him to sign-in page when he tries to go to dashboard page

const PrivateRoute = () => {
  const {currentUser} = useSelector((state)=>state.user);

  return (
    currentUser ? <Outlet /> : <Navigate to = '/sign-in' />
  )
}

export default PrivateRoute
