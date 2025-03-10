import { Navbar, TextInput ,Button} from 'flowbite-react'
import React from 'react'
import { Link,useLocation } from 'react-router-dom'
import {AiOutlineSearch} from 'react-icons/ai'
import {FaMoon} from 'react-icons/fa'

const Header = () => {
  const path=useLocation().pathname;
  return (
    <Navbar className='border-b-2'>
      <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Jatin's</span>
        Blog
      </Link>
      <form>
        <TextInput 
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch} 
          className='hidden lg:inline'
        />
      </form>

      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button>

{/* pill -for rounded button ,in larger screen toggle and signin at end and in smaller before menu(hamburger) therefore md:order-2*/}
    <div className='flex gap-2 md:order-2'>
      {/* dark-light mode toggle icon  */}
      <Button className='w-12 h-10 hidden sm:inline' color='gray' pill>
        <FaMoon />
      </Button>

       {/* sign in button */}
  <Link to='/sign-in'>
    <Button gradientDuoTone='purpleToBlue' outline>
      Sign In
    </Button>
  </Link>

{/* hamburger icon */}
  <Navbar.Toggle />
    </div>

  {/* menu , 2 links cannot be descendent to each other therefore we are making 1st link as div*/}
  <Navbar.Collapse>
    <Navbar.Link active={path === '/'} as={'div'}>
      <Link to='/'>
        Home
      </Link>
    </Navbar.Link>

    <Navbar.Link active={path === '/about'} as={'div'}>
      <Link to='/about' >
        About
      </Link>
    </Navbar.Link>

    <Navbar.Link active={path === '/projects'} as={'div'}>
      <Link to='/projects' >
        Projects
      </Link>
    </Navbar.Link>
  </Navbar.Collapse> 

    </Navbar>
  )
}

export default Header