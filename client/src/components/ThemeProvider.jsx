import {useSelector} from 'react-redux';

//we'll wrap our application with this theme provider so that all our application will be affected by this i.e whenever someone changes theme then it gets changed in the whole app
const ThemeProvider = ({children}) => {
  const {theme}= useSelector((state)=>state.theme);
  return (
    //theme will be set and will apply to all children
    //if theme white then bg-white and text=gray-700 and ig bg-dark then text=gray-200 and bg will be rgb color
    <div className={theme}>
      <div className='bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen'>
      {children}
      </div>
    </div>
  )
}

export default ThemeProvider
