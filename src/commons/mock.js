const sales = [
	{
		"_id": "64f258c9518ad7a76d5aa21a",
		"date": "2023-09-01T21:34:01.135Z",
		"customer": {
			"_id": "64b5e9af8ae1773cb43da6dd",
			"name": "Empresa Teste",
			"phone": "(35) 99961-5247",
			"address": "Rua A, 320 - Distrito Industrial - Três Pontas-MG",
			"code": "01.234.567-89",
			"comment": "blablablablabla",
			"active": true,
			"__v": 0
		},
		"subtotal": 1205,
		"discount": 0,
		"addition": 0,
		"total": 1205,
		"items": [
			{
				"product": {
					"_id": "64b5e614f97403082c206937",
					"name": "Produto 001",
					"price": 15,
					"cost": 7,
					"description": "blablablablablablablabla",
					"active": true,
					"__v": 0
				},
				"quantity": 3,
				"unitPrice": 15,
				"discount": 0,
				"addition": 0,
				"totalPrice": 45,
				"_id": "64f258c9518ad7a76d5aa21b"
			},
			{
				"product": {
					"_id": "64bf3c1d3561407202e0f074",
					"name": "Produto fldshdhfdliahsldkhlkfa 003",
					"price": 100,
					"cost": 55,
					"description": "aaaaaaaeeeeeeeeeeeiiiiiiiiioooooooouuuuuuuuu",
					"active": true,
					"__v": 0
				},
				"quantity": 2,
				"unitPrice": 100,
				"discount": 0,
				"addition": 0,
				"totalPrice": 200,
				"_id": "64f258c9518ad7a76d5aa21c"
			},
			{
				"product": {
					"_id": "64c023b13561407202e0f19c",
					"name": "asdlglkdasgahdslkgh",
					"price": 20,
					"cost": 10,
					"description": "asdlglkdasgahdslkgh",
					"active": true,
					"__v": 0
				},
				"quantity": 1,
				"unitPrice": 20,
				"discount": 0,
				"addition": 0,
				"totalPrice": 20,
				"_id": "64f258c9518ad7a76d5aa21d"
			},
			{
				"product": {
					"_id": "64c024373561407202e0f1b5",
					"name": "sdsdaisdig",
					"price": 180,
					"cost": 100,
					"description": "sdsdaisdig",
					"active": true,
					"__v": 0
				},
				"quantity": 3,
				"unitPrice": 180,
				"discount": 0,
				"addition": 0,
				"totalPrice": 540,
				"_id": "64f258c9518ad7a76d5aa21e"
			},
			{
				"product": {
					"_id": "64e6cd345b193bf6b09a87af",
					"name": "Teste 1",
					"price": 25,
					"cost": 14,
					"description": "...",
					"active": true,
					"__v": 0
				},
				"quantity": 4,
				"unitPrice": 25,
				"discount": 0,
				"addition": 0,
				"totalPrice": 100,
				"_id": "64f258c9518ad7a76d5aa21f"
			},
			{
				"product": {
					"_id": "64edc823518ad7a76d5a99cc",
					"name": "Teste 01",
					"price": 100,
					"cost": 150,
					"description": "Teste",
					"active": true,
					"__v": 0
				},
				"quantity": 3,
				"unitPrice": 100,
				"discount": 0,
				"addition": 0,
				"totalPrice": 300,
				"_id": "64f258c9518ad7a76d5aa220"
			}
		],
		"user": {
			"_id": "64b5cf23e768dafd2720b6a3",
			"email": "guilhermetempesta@gmail.com",
			"name": "Guilherme Lorenzon Tempesta"
		},
		"code": 24,
		"__v": 0
	},
	{
		"_id": "64f258f2518ad7a76d5aa225",
		"date": "2023-07-18T12:34:56.789Z",
		"customer": {
			"_id": "64b5e9af8ae1773cb43da6dd",
			"name": "Empresa Teste",
			"phone": "(35) 99961-5247",
			"address": "Rua A, 320 - Distrito Industrial - Três Pontas-MG",
			"code": "01.234.567-89",
			"comment": "blablablablabla",
			"active": true,
			"__v": 0
		},
		"subtotal": 99.9,
		"discount": 0,
		"addition": 0,
		"total": 99.9,
		"items": [
			{
				"product": {
					"_id": "64b5e614f97403082c206937",
					"name": "Produto 001",
					"price": 15,
					"cost": 7,
					"description": "blablablablablablablabla",
					"active": true,
					"__v": 0
				},
				"quantity": 10,
				"unitPrice": 9.99,
				"discount": 0,
				"addition": 0,
				"totalPrice": 99.9,
				"_id": "64f258f2518ad7a76d5aa226"
			}
		],
		"user": {
			"_id": "64b5cf23e768dafd2720b6a3",
			"email": "guilhermetempesta@gmail.com",
			"name": "Guilherme Lorenzon Tempesta"
		},
		"code": 25,
		"__v": 0
	}
];

// Função para remover aspas duplas dos nomes de campos
function removeQuotesFromKeys(obj) {
  const newObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = key.replace(/"/g, ''); // Remove todas as aspas duplas do nome do campo
      newObj[newKey] = obj[key];
    }
  }
  return newObj;
};

// Processar cada objeto no array JSON
export const salesMock = sales.map((item) => removeQuotesFromKeys(item));

console.log(salesMock);


