import MTMDataStore from "./MTMDataStore";

const store = MTMDataStore.getInstance();

(async () => {
  const result = await store.Insert(`
  INSERT INTO TAGS ("DATA") VALUES (?)
`, "{id:'test', data:'alert(\"test\")'}")

console.log(result)
console.log(await store.SelectAll(`SELECT * FROM TAGS`))
console.log(await store.Delete(`DELETE FROM TAGS WHERE ID=?`, 10))
store.Close();

})()

