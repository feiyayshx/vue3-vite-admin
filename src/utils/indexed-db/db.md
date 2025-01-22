## IndexedDB

是一个事务型，基于js的面向对象数据库。

** 使用基本模式：**

1. 打开数据库。
2. 在数据库中创建一个对象存储（object store）。
3. 启动事务，并发送一个请求来执行一些数据库操作，如添加或获取数据等。
4. 通过监听正确类型的 DOM 事件以等待操作完成。
5. 对结果进行一些操作（可以在 request 对象中找到）

事件触发：

1. 如果数据库不存在，onupgradeneeded事件触发(onupgradeneeded->onsuccess)，创建数据库模式
2. 数据库存在，指定更高的数据库版本，onupgradeneeded事件触发(onupgradeneeded->onsuccess)，更新数据库模式
