import { useAppSelector } from '@/app/hooks';
import { useNavigate } from 'react-router-dom'
import HeroSection from '../../components/common/Hero/HeroSection'
import Courses from './Courses';

function Home() {

  const navigate = useNavigate();
  const {user}  = useAppSelector((state) => state.auth)

  return (
    <div>{user && user.role ==='student' && 

          <div className='bg-blue-200 p-3'>
            <span>Want to become an instructor ? </span>
            <button onClick={() => navigate('/instructor/register')} className='bg-blue-600 p-2 rounded-sm text-white'>Click here</button>
          </div> 
    }


<div className='w-full'>

          <HeroSection />
</div>
        <div className='flex w-full'>

        
        </div>
        <div>
          
        </div>
        <div>
          <Courses/>
        </div>
    </div>
  )
}

export default Home