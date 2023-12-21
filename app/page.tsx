import Image from 'next/image'
import Descope from './Descope'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
        {/* <p>
         Welcome to Descope&apos;s NextJS Sample App!
        </p> */}
        <Descope
                flowId="sign-up-or-in"
            />
    </main>
  )
}
