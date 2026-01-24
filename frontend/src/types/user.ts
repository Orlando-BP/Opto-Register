export interface User {
	id?: number
	token: string | null
	name: string
	lastName1: string
	lastName2: string
	fullName: string
	email: string
	profilePic: string
	alumnCode: number
	bloodType: number
	permissions: number[]
	roles?: number[] // Array de IDs de roles del usuario
	status: "checking" | "authenticated" | "unauthenticated"
	username?: string
	phone?: string
	// Alias en algunos endpoints
	pais?: string | number
}

export interface UserAttributes {
	id: number
	username: string
	fullName: string
	firstName: string
	lastName1: string
	lastName2: string
}

export interface PermissionsAttributes {
	id: string
	name: string
	description?: string
	parent: string | null
	icon?: string
}

export interface UserPermissionsAttributes {
	id: string
	permissionID: string
	userID: string
}

export interface CentersAttributes {
	id: string
	name: string
	description?: string
}
