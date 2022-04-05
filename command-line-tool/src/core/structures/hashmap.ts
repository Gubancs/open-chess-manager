export class HashMap<K, V> extends Map<K, V> {

    getOrDefault(key: K, defaultValueProvider: ()=> V): V {
        let value = super.get(key)
        if(!value){
            value = defaultValueProvider()
            super.set(key, value)
        }
        return value
    }
}