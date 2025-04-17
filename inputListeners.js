// 提高代码复用，输入框重复捆绑监听
const listeners = {}; 		// 存储监听器引用的对象
export function createInputListener(min, max, useDelay = true) {
    if (useDelay) {
        // 添加延迟验证
        let timeoutId;
        return function(event) {
        let value = event.target.value.trim(); // 获取输入值并去除首尾空格

        if (value === '') {
            // 如果输入为空，则不进行验证
            clearTimeout(timeoutId); // 清除任何未执行的延迟
            return;
        }

        clearTimeout(timeoutId); // 清除之前的定时器
        timeoutId = setTimeout(() => {
            let numericValue = parseInt(value);
            if (isNaN(numericValue)) {
                numericValue = min;
            }
            if (numericValue < min) {
                numericValue = min;
            } else if (numericValue > max) {
                numericValue = max;
            }
            event.target.value = numericValue;
        }, 500); // 使用 delay 参数
        };
    } else {
        // 添加失焦验证
        return function(event) {
        let value = event.target.value.trim(); // 获取输入值并去除首尾空格
        if (value === '') {
            // 如果输入为空，则不进行验证
            return;
        }
        let numericValue = parseInt(value);
        if (isNaN(numericValue)) {
            numericValue = min;
        }
        if (numericValue < min) {
            numericValue = min;
        } else if (numericValue > max) {
            numericValue = max;
        }
        event.target.value = numericValue;
        };
    }
}

// 后续代码：移除监听器
export function removeListeners(removeInput = true) {
    console.log("我被remove了吗？？？？？")
    for (const inputId in listeners) {
        const input = document.getElementById(inputId);
        const eventType = removeInput === true ? "input" : "blur"
        if (input) {
            input.removeEventListener(eventType, listeners[inputId]);
            console.log(input);
        } else {
            console.log(`fail to remove ${input}的监听器`)
        }
    }
}

export function addInputListeners(inputIds, limits, listenInput = true) {	// 选择监听方式，默认Input
    for (let i = 0; i < inputIds.length; i++) {
        const input = document.getElementById(inputIds[i]);
        console.log(input);
        if (input) {
            const listener = createInputListener(limits[i][0], limits[i][1], listenInput);

            if(listenInput) {
                input.addEventListener('input', listener);
            } else {
                input.addEventListener('blur', listener);
            }

            listeners[inputIds[i]] = listener; // 存储监听器引用
        } else {
            console.log("Something wrong!")
        }
    }
}
