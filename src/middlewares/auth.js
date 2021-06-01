import api from "@/api/api";

export default function auth({next, router}) {
    console.log('lol')
    if (!localStorage.getItem('token')) {
        return router.push({name: 'Login'});
    }
    console.log('lol')
    try {
        let isAuthResponse = api.get('/auth/me')

        console.log(isAuthResponse);

        if (!isAuthResponse) {
            return router.push({name: 'Login'})
        }
    } catch (err) {
        console.log('lol')
        console.log(err)
    }

    return next();
}
