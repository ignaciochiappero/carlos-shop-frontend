 import { GetServerSideProps } from 'next';
 import ProfilePage from './page';  // Asumiendo que el componente principal está en un archivo separado
 import { requireAuthentication } from '@/lib/auth';

 export default ProfilePage;

 export const getServerSideProps: GetServerSideProps = async (context) => {
   try {
     // Verifica si el usuario está autenticado
     await requireAuthentication();
     return { props: {} };
   } catch (error) {
     // Si no está autenticado, redirige al login
     return {
       redirect: {
         destination: '/login?redirect=/profile',
         permanent: false,
       },
     };
   }
};