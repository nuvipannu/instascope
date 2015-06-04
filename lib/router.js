Router.configure({
	layoutTemplate: 'layout'
});

Router.route('/', {
	name: 'home',
	template: 'content'
});

AccountsTemplates.configureRoute('signUp', {
	name: 'signUp',
	path: '/sign-up'
});

AccountsTemplates.configureRoute('signIn', {
	name: 'signIn',
	path: '/sign-in'
});