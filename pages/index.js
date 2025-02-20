import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';



function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />

      <hr/>

      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>

      <hr/>

      <AlurakutProfileSidebarMenuDefault />
  
    </Box>
  )
}

function ProfiloRelationsBox(propriedades){

  return (

    <ProfileRelationsBoxWrapper>

      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>

      <ul>
        {/*{seguidores.map((itemAtual)=>{
          return (
            <li key={itemAtual}>
                <a href={`https://github.com/${itemAtual}.png`} >
                  <img src={itemAtual.image} />
                  <span>{itemAtual.title}</span>
                </a>
            </li>
          )
        })}*/}
      </ul>

    </ProfileRelationsBoxWrapper>

  )

}

export default function Home(props) {

  const usuarioAleatorio = props.githubUser;;
  
  const [comunidades, setComunidades] = React.useState([{
    id: '12802378123789378912789789123896123', 
    title: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
  }]);

  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]

  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(function(){

    fetch('https://api.github.com/users/sobrinhosergio/followers')
      .then(function (respostaDoServidor){
        return respostaDoServidor.json();
      })
      
      .then(function(respostaCompleta) {
        setSeguidores(respostaCompleta);
      })
    
  }, [])

  console.log('seguidores antes do return', seguidores);

  return (

    <>

      <AlurakutMenu/>
      
      <MainGrid>

        <div className="profileArea" style={{gridArea: 'profileArea'}}>
            <ProfileSidebar githubUser={usuarioAleatorio}/>
        </div>
      
        <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
          <Box>
            <h1 className="title">
              Bem vindo(a) 
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>

            <form onSubmit={function handleCriaComunidade(e){

                e.preventDefault();
                const dadosDoForm = new FormData(e.target);

                console.log('Campo: ', dadosDoForm.get('title'));
                console.log('Campo: ', dadosDoForm.get('image'));

                const comunidade = {
                  id: new Date().toISOString(),
                  title: dadosDoForm.get('title'),
                  image: dadosDoForm.get('image'),
                }
                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades(comunidadesAtualizadas)

            }}>

              <div>
                <input 
                  placeholder="Qual vai ser o nome da sua comunidade?" 
                  name="title" 
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>

              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa" 
                  name="image" 
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button>
                Criar comunidade
              </button>

            </form>

          </Box>
        </div>

        <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>

          <ProfiloRelationsBox title="seguidores" items={seguidores}/>

          <ProfileRelationsBoxWrapper>

            <h2 className="smallTitle">
              Comunidade ({comunidades.length})
            </h2>
            
          <ul>
              {comunidades.map((itemAtual)=>{
                return (
                  <li key={itemAtual.id}>
                      <a href={`/users/${itemAtual.title}`} >
                        <img src={itemAtual.image} />
                        <span>{itemAtual.title}</span>
                      </a>
                  </li>
                )
              })}
            </ul>

            </ProfileRelationsBoxWrapper>
            
            <ProfileRelationsBoxWrapper>

            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual)=>{
                return (
                  <li key={itemAtual}>
                      <a href={`/users/${itemAtual}`}>
                        <img src={`https://github.com/${itemAtual}.png`} />
                        <span>{itemAtual}</span>
                      </a>
                  </li>
                )
              })}
            </ul>

          </ProfileRelationsBoxWrapper>
        </div>    

      </MainGrid>

    </>
  
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN;
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
        Authorization: token
      }
  })
  .then((resposta) => resposta.json())

  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser
    }, // will be passed to the page component as props
  }
}
